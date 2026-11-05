package cli

import "io"

// Env carries everything a command needs from the outside world.
// Only main reads the real process values and fills it in.
type Env struct {
	Stdout     io.Writer // receives success output
	Stderr     io.Writer // receives error output
	WorkDir    string    // working directory of the process
	IsTerminal bool      // true when Stdout is a terminal
}
