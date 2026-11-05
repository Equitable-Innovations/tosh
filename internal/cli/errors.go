package cli

import "errors"

// ExitError is an error that carries the exit code for the process.
// Commands return it; only main exits the process.
type ExitError struct {
	Code int    // exit code, one of the Exit constants
	Name string // lowercase snake case name, used by the JSON error output
	Err  error  // wrapped cause, may be nil
}

// Error returns the cause text, or the error name when there is no cause.
func (e *ExitError) Error() string {
	if e.Err == nil {
		return e.Name
	}
	return e.Err.Error()
}

// Unwrap returns the wrapped cause, so errors.Is and errors.As work.
func (e *ExitError) Unwrap() error {
	return e.Err
}

// CodeOf turns any error into an exit code.
func CodeOf(err error) int {
	if err == nil {
		return ExitOK
	}
	var exitErr *ExitError
	if errors.As(err, &exitErr) {
		return exitErr.Code
	}
	return ExitFailure
}
