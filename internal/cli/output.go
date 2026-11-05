package cli

import (
	"encoding/json"
	"errors"
	"fmt"
)

// Format is the output format of a command.
type Format string

// The allowed output formats.
const (
	FormatText Format = "text"
	FormatJSON Format = "json"
)

const unexpectedErrorName = "unexpected_error"

// ParseFormat validates the --format value. An empty value selects the
// default: text for a terminal, json otherwise.
func ParseFormat(value string, isTerminal bool) (Format, error) {
	switch Format(value) {
	case FormatText, FormatJSON:
		return Format(value), nil
	case "":
		if isTerminal {
			return FormatText, nil
		}
		return FormatJSON, nil
	}
	return "", &ExitError{
		Code: ExitUsage,
		Name: "invalid_argument",
		Err:  fmt.Errorf("invalid format %q: allowed values are json, text", value),
	}
}

// Printer writes results and errors in one format.
type Printer struct {
	env    Env
	format Format
	quiet  bool
}

// NewPrinter creates a Printer for the given environment and format.
func NewPrinter(env Env, format Format, quiet bool) *Printer {
	return &Printer{env: env, format: format, quiet: quiet}
}

// Success prints one line to standard output: the text line, or the JSON
// encoding of value. It prints nothing in quiet mode.
func (p *Printer) Success(text string, value any) error {
	if p.quiet {
		return nil
	}
	if p.format == FormatJSON {
		return p.writeJSON(p.env.Stdout, value)
	}
	_, err := fmt.Fprintln(p.env.Stdout, text)
	return err
}

// Error prints one line to standard error, also in quiet mode.
// A failed write is ignored: nothing else can report it.
func (p *Printer) Error(err error) {
	name := unexpectedErrorName
	var exitErr *ExitError
	if errors.As(err, &exitErr) {
		name = exitErr.Name
	}
	if p.format == FormatJSON {
		_ = p.writeJSON(p.env.Stderr, map[string]string{"error": name, "message": err.Error()})
		return
	}
	_, _ = fmt.Fprintln(p.env.Stderr, err.Error())
}

// writeJSON writes value as one JSON line. The map keys sort, so the
// error object prints "error" before "message".
func (p *Printer) writeJSON(w interface{ Write([]byte) (int, error) }, value any) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	_, err = fmt.Fprintf(w, "%s\n", data)
	return err
}
