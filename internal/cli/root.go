package cli

import (
	"fmt"
	"io"
	"os"

	"github.com/spf13/cobra"
)

const (
	flagRoot   = "root"
	flagFormat = "format"
	flagQuiet  = "quiet"

	invalidArgumentName = "invalid_argument"
)

// NewRootCommand builds the root command with the four global flags.
// Subcommands are added to the result. It exists so that tests and Run
// build the same command tree.
func NewRootCommand(env Env) *cobra.Command {
	root := &cobra.Command{
		Use:   "tosh",
		Short: "Token Optimized Software Harness",
		// The Printer prints every error, so cobra stays silent.
		SilenceErrors: true,
		SilenceUsage:  true,
		Args:          noExtraArgs,
		// Without a run function cobra skips the flag checks (HAZ-002).
		RunE: func(cmd *cobra.Command, _ []string) error { return cmd.Help() },
		PersistentPreRunE: func(cmd *cobra.Command, _ []string) error {
			return validateGlobalFlags(cmd)
		},
	}
	root.SetOut(env.Stdout)
	root.SetErr(io.Discard)
	root.SetFlagErrorFunc(func(_ *cobra.Command, err error) error {
		return usageError(err)
	})
	root.CompletionOptions.DisableDefaultCmd = true

	flags := root.PersistentFlags()
	flags.String(flagRoot, "", "project root directory")
	flags.String(flagFormat, "", "output format: json or text (default: text on a terminal, json otherwise)")
	flags.Bool(flagQuiet, false, "print nothing on success")
	return root
}

// Run executes the CLI with the given arguments and returns the exit code.
// It never exits the process: only main does that.
func Run(env Env, args []string) int {
	return execute(NewRootCommand(env), env, args)
}

// execute runs root and prints any error with the Printer.
func execute(root *cobra.Command, env Env, args []string) int {
	root.SetArgs(args)
	err := root.Execute()
	if err == nil {
		return ExitOK
	}
	newErrorPrinter(root, env).Error(err)
	return CodeOf(err)
}

// newErrorPrinter picks the format for an error. A bad --format value
// falls back to the default, so the error itself can still print.
func newErrorPrinter(root *cobra.Command, env Env) *Printer {
	format, err := ParseFormat(flagValue(root, flagFormat), env.IsTerminal)
	if err != nil {
		format, _ = ParseFormat("", env.IsTerminal)
	}
	return NewPrinter(env, format, false)
}

func flagValue(cmd *cobra.Command, name string) string {
	value, err := cmd.PersistentFlags().GetString(name)
	if err != nil {
		return ""
	}
	return value
}

// validateGlobalFlags checks --format and --root at the command boundary.
func validateGlobalFlags(cmd *cobra.Command) error {
	root := cmd.Root()
	if _, err := ParseFormat(flagValue(root, flagFormat), false); err != nil {
		return err
	}
	if !root.PersistentFlags().Changed(flagRoot) {
		return nil
	}
	return checkDirectory(flagValue(root, flagRoot))
}

func checkDirectory(path string) error {
	info, err := os.Stat(path)
	if err != nil {
		return usageError(fmt.Errorf("invalid root %q: %w", path, err))
	}
	if !info.IsDir() {
		return usageError(fmt.Errorf("invalid root %q: not a directory", path))
	}
	return nil
}

// noExtraArgs rejects unknown commands and extra arguments.
func noExtraArgs(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		return nil
	}
	if cmd.HasSubCommands() || cmd.Parent() == nil {
		return usageError(fmt.Errorf("unknown command %q for %q", args[0], cmd.CommandPath()))
	}
	return usageError(fmt.Errorf("unexpected arguments: %v", args))
}

func usageError(err error) error {
	return &ExitError{Code: ExitUsage, Name: invalidArgumentName, Err: err}
}
