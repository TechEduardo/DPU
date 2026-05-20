import React, { useState } from 'react';
import { Button, DialogActions, DialogContent, Dialog, DialogContentText, DialogTitle, useMediaQuery, useTheme } from "@mui/material";

export default function Dialogo(props: any) {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleDialogClose = () => {
        props.setOpenDialog(false);
    }

    return (
        <>
            {props.openDialog &&
                <Dialog
                    fullScreen={fullScreen}
                    open={props.openDialog}
                    onClose={handleDialogClose}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">
                        {props.titulo}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {props.conteudo}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleDialogClose}>
                            Não
                        </Button>
                        <Button onClick={props.handleDialogSubmit} autoFocus>
                            Sim
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}
