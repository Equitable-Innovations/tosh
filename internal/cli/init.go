package cli

import (
	"errors"

	"github.com/spf13/cobra"

	"github.com/Equitable-Innovations/tosh/internal/initcmd"
)

const (
	alreadyInitializedName    = "already_initialized"
	alreadyInitializedMessage = initcmd.DirName + "/ already exists. No change made."
)

// initRunner creates the .tosh directory. It is a parameter so that tests
// can replace initcmd.Run.
type initRunner func(initcmd.Options) error

// newInitCommand builds the init command.
func newInitCommand(env Env, run initRunner) *cobra.Command {
	return &cobra.Command{
		Use:   "init",
		Short: "Create the .tosh directory in the project root",
		Args:  noExtraArgs,
		RunE: func(cmd *cobra.Command, _ []string) error {
			return executeInit(cmd, env, run)
		},
	}
}

func executeInit(cmd *cobra.Command, env Env, run initRunner) error {
	global := cmd.Root()
	format, err := ParseFormat(flagValue(global, flagFormat), env.IsTerminal)
	if err != nil {
		return err
	}
	if err := run(initcmd.Options{Root: projectRoot(global, env)}); err != nil {
		return initError(err)
	}
	quiet, _ := global.PersistentFlags().GetBool(flagQuiet)
	return NewPrinter(env, format, quiet).Success(
		"Created "+initcmd.DirName+"/",
		map[string]string{"created": initcmd.DirName},
	)
}

// projectRoot returns --root when given, else the working directory.
func projectRoot(global *cobra.Command, env Env) string {
	if global.PersistentFlags().Changed(flagRoot) {
		return flagValue(global, flagRoot)
	}
	return env.WorkDir
}

// initError maps the result of initcmd.Run to an exit code.
func initError(err error) error {
	if errors.Is(err, initcmd.ErrAlreadyInitialized) {
		return &ExitError{Code: ExitUsage, Name: alreadyInitializedName, Err: errors.New(alreadyInitializedMessage)}
	}
	return &ExitError{Code: ExitFailure, Name: unexpectedErrorName, Err: err}
}
