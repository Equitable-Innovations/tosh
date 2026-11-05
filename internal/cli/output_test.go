package cli

import (
	"bytes"
	"encoding/json"
	"errors"
	"strings"
	"testing"
)

func newTestPrinter(format Format, quiet bool) (*Printer, *bytes.Buffer, *bytes.Buffer) {
	out, errOut := &bytes.Buffer{}, &bytes.Buffer{}
	env := Env{Stdout: out, Stderr: errOut, WorkDir: "/work"}
	return NewPrinter(env, format, quiet), out, errOut
}

func TestFormatFlagUnknownValue(t *testing.T) {
	_, err := ParseFormat("xml", true)
	var exitErr *ExitError
	if !errors.As(err, &exitErr) {
		t.Fatalf("want ExitError, got %v", err)
	}
	if exitErr.Code != ExitUsage || exitErr.Name != "invalid_argument" {
		t.Errorf("got code %d name %q", exitErr.Code, exitErr.Name)
	}
	if !strings.Contains(exitErr.Error(), "json") || !strings.Contains(exitErr.Error(), "text") {
		t.Errorf("message %q must list json and text", exitErr.Error())
	}
}

func TestFormatFlagKnownValues(t *testing.T) {
	for _, value := range []string{"text", "json"} {
		got, err := ParseFormat(value, false)
		if err != nil || string(got) != value {
			t.Errorf("ParseFormat(%q) = %q, %v", value, got, err)
		}
	}
}

func TestDefaultFormatTerminal(t *testing.T) {
	got, err := ParseFormat("", true)
	if err != nil || got != FormatText {
		t.Errorf("got %q, %v", got, err)
	}
}

func TestDefaultFormatPipe(t *testing.T) {
	got, err := ParseFormat("", false)
	if err != nil || got != FormatJSON {
		t.Errorf("got %q, %v", got, err)
	}
}

func TestPrinterSuccessText(t *testing.T) {
	p, out, _ := newTestPrinter(FormatText, false)
	if err := p.Success("Created .tosh/", map[string]string{"created": ".tosh"}); err != nil {
		t.Fatal(err)
	}
	if out.String() != "Created .tosh/\n" {
		t.Errorf("got %q", out.String())
	}
}

func TestPrinterSuccessJSON(t *testing.T) {
	p, out, _ := newTestPrinter(FormatJSON, false)
	if err := p.Success("Created .tosh/", map[string]string{"created": ".tosh"}); err != nil {
		t.Fatal(err)
	}
	if out.String() != "{\"created\":\".tosh\"}\n" {
		t.Errorf("got %q", out.String())
	}
}

func TestQuietSuppressesSuccessOutput(t *testing.T) {
	for _, format := range []Format{FormatText, FormatJSON} {
		p, out, _ := newTestPrinter(format, true)
		if err := p.Success("x", map[string]string{"a": "b"}); err != nil {
			t.Fatal(err)
		}
		if out.Len() != 0 {
			t.Errorf("%s: stdout not empty: %q", format, out.String())
		}
	}
}

func TestQuietKeepsErrorOutput(t *testing.T) {
	p, out, errOut := newTestPrinter(FormatText, true)
	p.Error(&ExitError{Code: ExitUsage, Name: "already_initialized", Err: errors.New("exists")})
	if errOut.String() != "exists\n" {
		t.Errorf("stderr = %q", errOut.String())
	}
	if out.Len() != 0 {
		t.Errorf("stdout = %q", out.String())
	}
}

func TestPrinterErrorJSON(t *testing.T) {
	p, _, errOut := newTestPrinter(FormatJSON, false)
	p.Error(&ExitError{Code: ExitUsage, Name: "already_initialized", Err: errors.New("exists")})
	want := "{\"error\":\"already_initialized\",\"message\":\"exists\"}\n"
	if errOut.String() != want {
		t.Errorf("got %q", errOut.String())
	}
}

func TestJSONErrorEscapesMessage(t *testing.T) {
	p, _, errOut := newTestPrinter(FormatJSON, false)
	p.Error(&ExitError{Code: ExitFailure, Name: "x", Err: errors.New("say \"hi\"\nnow")})
	var decoded map[string]string
	if err := json.Unmarshal(errOut.Bytes(), &decoded); err != nil {
		t.Fatalf("invalid JSON %q: %v", errOut.String(), err)
	}
	if decoded["message"] != "say \"hi\"\nnow" {
		t.Errorf("message = %q", decoded["message"])
	}
	if strings.Count(errOut.String(), "\n") != 1 {
		t.Errorf("output must be one line: %q", errOut.String())
	}
}

func TestPrinterPlainError(t *testing.T) {
	p, _, errOut := newTestPrinter(FormatJSON, false)
	p.Error(errors.New("boom"))
	want := "{\"error\":\"unexpected_error\",\"message\":\"boom\"}\n"
	if errOut.String() != want {
		t.Errorf("got %q", errOut.String())
	}
}
