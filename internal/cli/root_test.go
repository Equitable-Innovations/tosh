package cli

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/spf13/cobra"
)

func runCLI(t *testing.T, args ...string) (code int, stdout, stderr string) {
	t.Helper()
	out, errOut := &bytes.Buffer{}, &bytes.Buffer{}
	env := Env{Stdout: out, Stderr: errOut, WorkDir: t.TempDir()}
	code = Run(env, args)
	return code, out.String(), errOut.String()
}

func errorName(t *testing.T, stderr string) string {
	t.Helper()
	var decoded map[string]string
	if err := json.Unmarshal([]byte(stderr), &decoded); err != nil {
		t.Fatalf("stderr %q is not JSON: %v", stderr, err)
	}
	return decoded["error"]
}

func TestRootFlagMissingPath(t *testing.T) {
	missing := filepath.Join(t.TempDir(), "no-such-dir")
	code, _, stderr := runCLI(t, "--format", "json", "--root", missing)
	if code != ExitUsage {
		t.Errorf("code = %d, want %d", code, ExitUsage)
	}
	if name := errorName(t, stderr); name != "invalid_argument" {
		t.Errorf("error name = %q", name)
	}
	if !strings.Contains(stderr, "no-such-dir") {
		t.Errorf("stderr %q must name the path", stderr)
	}
}

func TestRootFlagIsFile(t *testing.T) {
	file := filepath.Join(t.TempDir(), "file.txt")
	if err := os.WriteFile(file, []byte("x"), 0o644); err != nil {
		t.Fatal(err)
	}
	code, _, stderr := runCLI(t, "--format", "json", "--root", file)
	if code != ExitUsage {
		t.Errorf("code = %d, want %d", code, ExitUsage)
	}
	if name := errorName(t, stderr); name != "invalid_argument" {
		t.Errorf("error name = %q", name)
	}
}

func TestRootFlagDirectory(t *testing.T) {
	code, _, stderr := runCLI(t, "--root", t.TempDir())
	if code != ExitOK {
		t.Errorf("code = %d, stderr %q", code, stderr)
	}
}

func TestRootFlagUnknownFormatNoSubcommand(t *testing.T) {
	code, _, stderr := runCLI(t, "--format", "xml")
	if code != ExitUsage {
		t.Errorf("code = %d, want %d", code, ExitUsage)
	}
	if !strings.Contains(stderr, "json") || !strings.Contains(stderr, "text") {
		t.Errorf("stderr %q must name json and text", stderr)
	}
}

func TestUnknownFlag(t *testing.T) {
	code, stdout, stderr := runCLI(t, "--bogus")
	if code != ExitUsage {
		t.Errorf("code = %d, want %d", code, ExitUsage)
	}
	if stderr == "" || strings.Contains(stdout+stderr, "Usage:") {
		t.Errorf("want one error and no usage text: %q %q", stdout, stderr)
	}
}

func TestUnknownCommand(t *testing.T) {
	code, stdout, stderr := runCLI(t, "nosuchcommand")
	if code != ExitUsage {
		t.Errorf("code = %d, want %d", code, ExitUsage)
	}
	if stderr == "" || strings.Contains(stdout+stderr, "Usage:") {
		t.Errorf("want one error and no usage text: %q %q", stdout, stderr)
	}
}

func TestHelpListsGlobalFlags(t *testing.T) {
	code, stdout, _ := runCLI(t, "--help")
	if code != ExitOK {
		t.Errorf("code = %d", code)
	}
	for _, want := range []string{"--root", "--format", "--quiet", "--help"} {
		if !strings.Contains(stdout, want) {
			t.Errorf("help lacks %s: %q", want, stdout)
		}
	}
	if strings.Contains(stdout, "completion") {
		t.Errorf("help must not list completion: %q", stdout)
	}
}

func TestNoSubcommandPrintsHelp(t *testing.T) {
	code, stdout, _ := runCLI(t)
	if code != ExitOK || !strings.Contains(stdout, "--root") {
		t.Errorf("code %d, stdout %q", code, stdout)
	}
}

func TestCompletionCommandDoesNotExist(t *testing.T) {
	code, _, _ := runCLI(t, "completion")
	if code != ExitUsage {
		t.Errorf("code = %d, want %d", code, ExitUsage)
	}
}

func TestRunPlainErrorExitsOne(t *testing.T) {
	out, errOut := &bytes.Buffer{}, &bytes.Buffer{}
	env := Env{Stdout: out, Stderr: errOut}
	root := NewRootCommand(env)
	root.AddCommand(&cobra.Command{
		Use:  "boom",
		RunE: func(*cobra.Command, []string) error { return os.ErrInvalid },
	})
	code := execute(root, env, []string{"--format", "json", "boom"})
	if code != ExitFailure {
		t.Errorf("code = %d, want %d", code, ExitFailure)
	}
	if name := errorName(t, errOut.String()); name != "unexpected_error" {
		t.Errorf("error name = %q", name)
	}
}

func TestRunQuietInvalidFormat(t *testing.T) {
	code, _, stderr := runCLI(t, "--quiet", "--format", "xml")
	if code != ExitUsage || stderr == "" {
		t.Errorf("code %d, stderr %q", code, stderr)
	}
}
