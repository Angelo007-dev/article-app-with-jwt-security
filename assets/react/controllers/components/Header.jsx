import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import { visit } from '../utils';
import Avatar from '@mui/material/Avatar';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.up('sm')]: {
        padding: '0.5rem 1rem',
    },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        padding: '0.5rem',
    },
}));

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '1.5rem',
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        //delete the token  to logout
        localStorage.removeItem('jwt_token');
        visit('/');
    };

    //catch the user connected
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                try {
                    const response = await fetch('https://127.0.0.1:8000/api/user', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setUser(data);
                    console.log('User: ', data)
                } catch (error) {
                    console.log('Error on fetch the user ', error);
                    setUser(null);
                }
            }
        };
        fetchUser();
    }, [])
    return (
        <StyledAppBar position="sticky">
            <Container maxWidth="lg">
                <StyledToolbar>
                    <Typography variant="h6" component="div">
                        Test-Code
                    </Typography>

                    <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <StyledButton>Accueil</StyledButton>
                        <StyledButton>À propos</StyledButton>
                        <StyledButton>Contact</StyledButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {user ? (
                            <>
                                <Avatar alt={user.email?.charAt(0).toUpperCase()} />
                                <Typography variant="body1">{user.email}</Typography>
                                <StyledButton onClick={handleLogout}>Logout</StyledButton>
                            </>
                        ) : (
                            <StyledButton onClick={() => visit('/')}>Login</StyledButton>
                        )}

                        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                            <IconButton color="inherit" onClick={handleClick}>
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose}>Accueil</MenuItem>
                                <MenuItem onClick={handleClose}>À propos</MenuItem>
                                <MenuItem onClick={handleClose}>Contact</MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </StyledToolbar>
            </Container>
        </StyledAppBar>
    );
};

export default Navbar;