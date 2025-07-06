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
import Link from '@mui/material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
//import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { visit } from '../../utils';

export default function LoginSignUp() {
    /*Visibility of the password or not*/
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);


    const [action, setAction] = useState("Sign In");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");


    //State of errers in each  forms
    const [isEmailError, setIsEmailError] = useState(false);
    const [emailTextError, setEmailTextError] = useState("");
    const [isPassError, setIsPassError] = useState(false);
    const [passTextError, setPassTextError] = useState("");
    const [isConfirmPassError, setIsConfirmPassError] = useState(false);
    const [confirmPassTextError, setConfirmPassTextError] = useState("");

    //State for global succes or error message 
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    //const navigate = useNavigate();

    //reset error o fiels
    const resetError = () => {
        setIsEmailError(false);
        setEmailTextError("");
        setIsPassError(false);
        setPassTextError("");
        setIsConfirmPassError(false);
        setConfirmPassTextError("");
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason == 'clickaway') {
            return;
        }
        setIsSnackbarOpen(false)
    };
    const handleSubmit = async (event) => {
        event.preventDefault();//not reloading the page
        resetError(); //reset errer before the submission 
        //validation
        let hasError = false;
        if (!email) {
            setIsEmailError(true);
            setEmailTextError("email is required");
            hasError = true;
        }
        if (action !== "Forgot Password" && !password) {
            setIsPassError(true);
            setPassTextError("password is required");
            hasError = true;
        }
        if (action === "Sign Up" && password !== confirmPass) {
            setIsConfirmPassError(true);
            setConfirmPassTextError("password not matching");
            hasError = true;
        }
        if (hasError) {
            return; //we stop the submission if there is an error
        }
        let url = '';
        let body = {};
        const API_BASE_URL = 'https://127.0.0.1:8000';
        if (action === "Sign Up") {
            url = `${API_BASE_URL}/api/register`;
            body = { email, password };
        } else if (action === "Sign In") {
            url = `${API_BASE_URL}/login_check`;
            body = { email, password };
        } else if (action === "Forgot Password") {
            url = `${API_BASE_URL}/forgot-pass`;
            body = { email, password };
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            console.log("Reponse Backend:", data);
            if (response.ok) {
                //success
                setSnackbarMessage(`${action} réussi`);
                setSnackbarSeverity("Success");
                setIsSnackbarOpen(true);
                if (action === "Sign Up") {
                    setEmail('');
                    setPassword('');
                    setConfirmPass('');
                    setAction("Sign In"); //redirect to the connexion page
                } else if (action === "Sign In") {
                    if (data.token) {
                        localStorage.setItem("jwt_token", data.token) //store the token i
                        setSnackbarMessage("Connexion réussi");
                        setSnackbarSeverity("success");
                        setIsSnackbarOpen(true);
                        console.log(localStorage.getItem("jwt_token"));
                        //navigate("/articles")
                        visit('/articles')
                    }
                }

            } else {
                setSnackbarMessage(data.message || `Erreur lors de la connexion.`);
                setSnackbarSeverity("error");
                setIsSnackbarOpen(true);
                if (data.message && data.message.toLowerCase().includes("invalid")) {
                    setIsEmailError(true);
                    setEmailTextError("Email or password invalid");
                    setIsPassError(true);
                    setPassTextError("Email or password invalid");
                }
                if (data.errors) {
                    if (data.errors.email) {
                        setIsEmailError(true);
                        setEmailTextError(data.errors.email);
                    }
                    if (data.errors.password) {
                        setIsPassError(true);
                        setPassTextError(data.errors.password);
                    }
                }
            }
        } catch (error) {
            //request or network error
            console.error("Error network or server: ", error);
            setSnackbarMessage(`Connexion to the server impossible: ${error.message}`);
            setSnackbarSeverity("error");
            setIsSnackbarOpen(true);
        }
    }
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
                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    <TextField
                        placeholder="Enter Email"
                        name='email'
                        type='email'
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={isEmailError} //link into the error state of the email and like that for the password
                        helperText={emailTextError}
                    />
                    {action !== "Forgot Password" && (
                        <>
                            <TextField
                                placeholder="Enter Password"
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                required
                                sx={{ mb: 2 }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={isPassError}
                                helperText={passTextError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>)

                                }}
                            />
                            {action === "Sign Up" && (//Only for confirm password)
                                <TextField
                                    placeholder="Confirm Password"
                                    name='confirmPass'
                                    type={showConfirmPass ? 'text' : 'password'}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    error={isConfirmPassError}
                                    helperText={confirmPassTextError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" >
                                                <IconButton
                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                >
                                                    {showConfirmPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>)
                                    }}
                                />
                            )}
                        </>
                    )}

                    <Button type='submit' variant='contained' fullWidth sx={{ mt: 1 }}>{action}</Button>
                </Box>
                <Grid container justifyContent={"space-between"} sx={{ mt: 2 }}>
                    {action !== "Forgot Password" && (
                        <Grid>
                            <Link component="button" onClick={() => {
                                setAction("Forgot Password");
                                resetError();
                            }}
                            >
                                Forgot Password
                            </Link>
                        </Grid>
                    )}
                    {action === "Sign In" ? (
                        <Grid>
                            <Link component="button" onClick={() => {
                                setAction("Sign Up");
                                resetError();
                            }}
                            >
                                Sign Up
                            </Link>
                        </Grid>
                    ) : (
                        <Grid>
                            <Link component="button" onClick={() => {
                                setAction("Sign In");
                                resetError();

                            }}>
                                Already have Account ? Sign In
                            </Link>
                        </Grid>
                    )}
                </Grid>
            </Paper>
            {/* For the global message  using snackBbar*/}
            <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container >
    )
}
