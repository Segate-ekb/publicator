import React, { useCallback, useEffect } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";

const SnackbarHandler = ({ snackbar, closeSnackbar }) => {
  const { enqueueSnackbar, closeSnackbar: dequeueSnackbar } = useSnackbar();

  const action = useCallback(
    (key) => (
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => {
          closeSnackbar(key);
          dequeueSnackbar(key);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    ),
    [closeSnackbar, dequeueSnackbar]
  );

  useEffect(() => {
    if (snackbar) {
      const key = enqueueSnackbar(snackbar.message, {
        variant: snackbar.severity,
        autoHideDuration: 6000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        action: (key) => action(key),
      });

      closeSnackbar(key);
    }
  }, [snackbar, closeSnackbar, enqueueSnackbar, action]);

  return null;
};

export default SnackbarHandler;