"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import Button from "@src/components/buttons/Buttons";
import Checkbox from "@src/components/checkbox/Checkbox";
import Saly from "@src/components/saly/Saly";
import styles from "./page.module.css";

export default function SignUp() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isChecked, setIsChecked] = useState(true);

  const router = useRouter();

  const handleGoogleSignIn = () => {
    router.push("/auth/redirect");
  };

  const handleSubmit = () => {
    router.push("/auth/redirect");
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.signIn}>
      <div className={styles.group}>
        <div className={styles.signUpOffer}>
          <div className={styles.description}>Already have an account?</div>
          <Link href="/auth/login">
            <div className={styles.description2}>Sign in now</div>
          </Link>
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            className={styles.buttonInstance}
            divClassName={styles.designComponentInstanceNode}
            leftIcon={false}
            rightIcon={false}
            size="xs"
            text="Sign Up"
            variant="solid"
            onClick={handleSubmit}
          />
        </div>
        <div className={styles.frame}>
          <button onClick={handleGoogleSignIn} className={styles.googleButton}>
            <div className={styles.google}>
              <div className={styles.overlapGroup}>
                <img
                  className={styles.googleGLogo}
                  alt="Google g logo"
                  src="https://c.animaapp.com/2gdwBOyI/img/google--g--logo-1.svg"
                />
                <div className={styles.textWrapper3}>Sign up with Google</div>
              </div>
            </div>
          </button>
          <div className={styles.separator}>
            <div className={styles.textWrapper4}>or</div>
            <img
              className={styles.line}
              alt="Line"
              src="https://c.animaapp.com/2gdwBOyI/img/line-17.svg"
            />
            <img
              className={styles.img}
              alt="Line"
              src="https://c.animaapp.com/2gdwBOyI/img/line-18.svg"
            />
          </div>
          <div className={styles.div2}>
            <p className={styles.p}>
              <span className={styles.span}>Email</span>
              <span className={styles.textWrapper5}>*</span>
            </p>
            <input
              type="email"
              className={styles.largeInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@simmmple.com"
              suppressHydrationWarning={true}
            />
          </div>
          <div className={styles.div2}>
            <p className={styles.p}>
              <span className={styles.span}>Password</span>
              <span className={styles.textWrapper5}>*</span>
            </p>
            <input
              type="password"
              className={styles.largeInput}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suppressHydrationWarning={true}
            />
          </div>
          <div className={styles.div2}>
            <p className={styles.p}>
              <span className={styles.span}>Confirm Password</span>
              <span className={styles.textWrapper5}>*</span>
            </p>
            <input
              type="password"
              className={styles.largeInput}
              placeholder="Min. 8 characters"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              suppressHydrationWarning={true}
            />
          </div>
          <div className={styles.forgotAndCheckbox}>
            <div className={styles.checkbox2}>
              <div className={styles.textWrapper7}>Keep me logged in</div>
              <Checkbox
                className={styles.checkboxInstance}
                isChecked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                size="lg"
              />
            </div>
            <div className={styles.forgotPass}>
              <Link href="/auth/account-recovery">
                <div className={styles.textWrapper8}>Forget password?</div>
              </Link>
            </div>
          </div>
        </div>
        <header className={styles.header}>
          <div className={styles.title}>Sign Up</div>
          <p className={styles.textWrapper9}>
            Enter your email and password to sign up!
          </p>
        </header>
      </div>
      <div className={styles.overlapWrapper}>
        <div className={styles.overlap2}>
          <div className={styles.groupWrapper}>
            <div className={styles.group2}>
              <div className={styles.textWrapper10}>Welcome!</div>
              <div className={styles.textWrapper11}>
                Brain Exercise Initiative
              </div>
            </div>
          </div>
          <Saly
            bei="https://c.animaapp.com/2gdwBOyI/img/bei-1-1@2x.png"
            className={styles.saly14}
          />
        </div>
      </div>
    </div>
  );
}

SignUp.title = "Sign Up | Brain Exercise Initiative";
