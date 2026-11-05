// Command tosh is the entry point of the tosh CLI.
package main

import (
	"fmt"
	"os"

	"github.com/Equitable-Innovations/tosh/internal/cli"
)

func main() {
	workDir, err := os.Getwd()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(cli.ExitFailure)
	}
	env := cli.Env{
		Stdout:     os.Stdout,
		Stderr:     os.Stderr,
		WorkDir:    workDir,
		IsTerminal: isTerminal(os.Stdout),
	}
	os.Exit(cli.Run(env, os.Args[1:]))
}

// isTerminal reports whether f is a character device, such as a console.
// The standard library suffices, so no extra dependency is needed.
func isTerminal(f *os.File) bool {
	info, err := f.Stat()
	return err == nil && info.Mode()&os.ModeCharDevice != 0
}
