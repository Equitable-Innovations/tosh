// Package cli holds the command surface of tosh.
package cli

// Exit codes of the CLI, as listed in the CLI specification.
const (
	ExitOK              = 0
	ExitFailure         = 1
	ExitUsage           = 2
	ExitInvalidDocument = 3
	ExitGateFailed      = 4
	ExitDrift           = 5
	ExitConflict        = 6
)
