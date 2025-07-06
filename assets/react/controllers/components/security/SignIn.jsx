import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MailLockOutlinedIcon from '@mui/icons-material/MailLockOutlined';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from 'react-dom';

export default function LoginSignUp() {
    return (
        <Container maxWidth="xs">
            <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
                <Avatar sx={{
                    mx: "auto",
                    bgcolor: "primary.main",
                    textAlign: "center",
                    mb: 1,
                }}>
                    <MailLockOutlinedIcon />
                </Avatar>
                <Typography component={"h1"} variant="h5" sx={{ textAlign: "center", }}>
                    {action}
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        placeholder="Enter Email"
                        name='email'
                        type='email'
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        placeholder="Enter Password"
                        name='password'
                        type='password'
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button type='submit' variant='contained' fullWidth sx={{ mt: 1 }}>Sign In</Button>
                </Box>
                <Grid container justifyContent={"space-between"} sx={{ mt: 2 }}>
                    <Grid item>
                        <Link to='/forgot-pass'>Forgot Password</Link>
                    </Grid>
                    <Grid item>
                        <Link to='/login'>Sign In</Link>
                    </Grid>
                    <Grid item>
                        <Link to='/'>Do no have an Account ? Sign Up </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}
