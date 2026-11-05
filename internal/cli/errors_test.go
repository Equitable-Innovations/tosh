package cli

import (
	"errors"
	"fmt"
	"io"
	"testing"
)

func TestExitCodeValues(t *testing.T) {
	cases := map[string]struct{ got, want int }{
		"ExitOK":              {ExitOK, 0},
		"ExitFailure":         {ExitFailure, 1},
		"ExitUsage":           {ExitUsage, 2},
		"ExitInvalidDocument": {ExitInvalidDocument, 3},
		"ExitGateFailed":      {ExitGateFailed, 4},
		"ExitDrift":           {ExitDrift, 5},
		"ExitConflict":        {ExitConflict, 6},
	}
	for name, c := range cases {
		if c.got != c.want {
			t.Errorf("%s = %d, want %d", name, c.got, c.want)
		}
	}
}

func TestCodeOfNil(t *testing.T) {
	if got := CodeOf(nil); got != ExitOK {
		t.Errorf("CodeOf(nil) = %d, want %d", got, ExitOK)
	}
}

func TestCodeOfPlainError(t *testing.T) {
	if got := CodeOf(io.EOF); got != ExitFailure {
		t.Errorf("CodeOf(io.EOF) = %d, want %d", got, ExitFailure)
	}
}

func TestCodeOfExitError(t *testing.T) {
	err := &ExitError{Code: ExitConflict, Name: "already_initialized", Err: io.EOF}
	if got := CodeOf(err); got != ExitConflict {
		t.Errorf("CodeOf = %d, want %d", got, ExitConflict)
	}
}

func TestCodeOfWrappedExitError(t *testing.T) {
	inner := &ExitError{Code: ExitUsage, Name: "invalid_argument", Err: io.EOF}
	err := fmt.Errorf("outer: %w", inner)
	if got := CodeOf(err); got != ExitUsage {
		t.Errorf("CodeOf = %d, want %d", got, ExitUsage)
	}
}

func TestExitErrorWithoutCause(t *testing.T) {
	err := &ExitError{Code: ExitFailure, Name: "boom"}
	if got := err.Error(); got != "boom" {
		t.Errorf("Error() = %q, want %q", got, "boom")
	}
}

func TestExitErrorUnwrap(t *testing.T) {
	err := fmt.Errorf("x: %w", &ExitError{Code: ExitDrift, Name: "drift", Err: io.EOF})
	if !errors.Is(err, io.EOF) {
		t.Error("errors.Is should find the wrapped error")
	}
	var exitErr *ExitError
	if !errors.As(err, &exitErr) || exitErr.Name != "drift" {
		t.Error("errors.As should find the ExitError")
	}
}
