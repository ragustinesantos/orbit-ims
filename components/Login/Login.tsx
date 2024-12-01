"use client";

import { Input, Button, Text } from '@mantine/core';
import { useUserAuth } from "@/app/_utils/auth-context";
import Image from 'next/image';
import styles from './Login.module.css';
import { useState } from 'react';

export default function Login({
    handleLogin,
  }: {
    handleLogin: (
      user: string,
      pass: string,
      errors: (hasError: boolean) => void,
    ) => void;
  }): React.JSX.Element {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(false);

    const handleUsername = (text: string) => {
        setUsername(text);
      };
      const handlePassword = (text: string) => {
        setPassword(text);
      };

    return(
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <Image 
                    src="/assets/logo/orbit_logo.png"
                    alt="Orbit Logo"
                    width={300}
                    height={150}
                    className={styles.logo}
                />
                
                <h1 className={styles.title}>Welcome Back!</h1>
                
                <div className={styles.inputGroup}>
                    <Input
                        placeholder="Type Your Username"
                        size="md"
                        value={username}
                        onChange={(event) => handleUsername(event.target.value)}
                        className={styles.input}
                    />
                    
                    <Input
                        type="password"
                        placeholder="Type Your Password"
                        size="md"
                        value={password}
                        onChange={(event) => handlePassword(event.target.value)}
                        className={styles.input}
                    />

                    <Text className={styles.errorTxt}>
                        {errors && 'Sorry, we could not find your account.'}
                    </Text>
                </div>

                <Button 
                    fullWidth
                    size="md"
                    className={styles.loginButton}
                    onClick={() => handleLogin(username, password, setErrors)}
                >
                    Login
                </Button>

                <div className={styles.footer}>
                    <p className={styles.noAccount}>Don't Have an Account yet?</p>
                    <p className={styles.contact}>
                        Please Contact a System Admin at
                        <br />
                        <a href="mailto:sysadmin@Orbit.Wingkei.ca">sysadmin@Orbit.Wingkei.ca</a>
                    </p>
                </div>
            </div>
        </div>
    );
}