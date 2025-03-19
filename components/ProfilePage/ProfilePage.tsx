'use client';

import { useState } from 'react';
import { Button, Group, Modal, SimpleGrid, Text } from '@mantine/core';
import { useUserAuth } from '@/app/_utils/auth-context';
import { useInventory } from '@/app/_utils/inventory-context';
import { sendResetEmail } from '@/app/_utils/utility';
import CustomNotification from '../CustomNotification/CustomNotification';
import classnames from './ProfilePage.module.css';

export default function ProfilePage() {
  // Use the useUserAuth hook to get the user object and the login and logout functions
  const { currentEmployee } = useInventory();
  const [modalshow, setModalshow] = useState<boolean>(false);

  const [notificationMessage, setNotificationMessage] = useState(<div />);
  const [showNotification, setShowNotification] = useState(false);

  const { firebaseSignOut } = useUserAuth();

  const handleLogout = async () => {
    if (firebaseSignOut) {
      await firebaseSignOut();
    }
    window.location.replace('/');
  };

  const showmodal = () => {
    setModalshow(true);
  };
  function close() {
    setModalshow(false);
  }

  const resetpass = async (email: string | undefined) => {
    if (!email) {
      console.error('Email is undefined');
      return;
    }

    try {
      const response = await sendResetEmail(email);
      if (response) {
        setNotificationMessage(
          CustomNotification('success', 'Password reset email sent!', ``, setShowNotification)
        );
        revealNotification();
      }
    } catch (error) {
      //console.log(error);
      setNotificationMessage(
        CustomNotification(
          'error',
          'Error Encountered',
          'Unexpected Error encountered. Please try again.',
          setShowNotification
        )
      );
      revealNotification();
    }
    close();
  };

  // Function to reveal any triggered notification
  const revealNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className={classnames.externalLayout}>
      <div className={classnames.internalLayoutGroup}>
        <div className={classnames.titleAndPhoto}>
          <p className={classnames.rootText}>Profile</p>
          <img
            className={classnames.photo}
            src={
              'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png'
            }
          />
        </div>
        <div className={classnames.simplegrid1}>
          <SimpleGrid cols={2} verticalSpacing="xl">
            <div className={classnames.title}>First Name:</div>
            <div>{currentEmployee?.firstName}</div>
            <div className={classnames.title}>Last Name:</div>
            <div>{currentEmployee?.lastName}</div>
            <div className={classnames.title}>Email:</div>
            <div>{currentEmployee?.email}</div>
            <div className={classnames.title}>Phone:</div>
            <div>{currentEmployee?.phone}</div>
            <div className={classnames.title}>Position:</div>
            <div>{currentEmployee?.position}</div>
            <div className={classnames.title}>Department:</div>
            <div>{currentEmployee?.department}</div>
            <div className={classnames.title}>Access Level:</div>
            <div>{currentEmployee?.employeeLevel[0] ? currentEmployee?.employeeLevel[0] + ", " : ""} 
                                 {currentEmployee?.employeeLevel[1] ? currentEmployee?.employeeLevel[1] + ", " : ""}  
                                 {currentEmployee?.employeeLevel[2] ? currentEmployee?.employeeLevel[2] + ", " : ""} 
                                 {currentEmployee?.employeeLevel[3] ? currentEmployee?.employeeLevel[3] + ", " : ""} 
                                 {currentEmployee?.employeeLevel[4] ? currentEmployee?.employeeLevel[4] + ", " : ""} 
                                 {currentEmployee?.employeeLevel[5] ? currentEmployee?.employeeLevel[5] : ""}</div>
          </SimpleGrid>
          <div>
            <Button variant="filled" onClick={showmodal} classNames={{ root: classnames.button }}>
              Change Password
            </Button>
            <Button
              variant="filled"
              onClick={handleLogout}
              classNames={{ root: classnames.button }}
            >
              Logout
            </Button>
            <Modal opened={modalshow} onClose={close} title="Confirmation" centered>
              <Text
                classNames={{
                  root: classnames.rootConfirmationText,
                }}
              >
                Send Reset Password email to {currentEmployee?.email}?
              </Text>
              <Group classNames={{ root: classnames.rootBtnArea }}>
                <Button
                  classNames={{ root: classnames.rootBtn }}
                  onClick={() => resetpass(currentEmployee?.email)}
                  color="#1B4965"
                >
                  Proceed
                </Button>
                <Button
                  classNames={{ root: classnames.rootBtn }}
                  onClick={() => close()}
                  color="red"
                >
                  Cancel
                </Button>
              </Group>
            </Modal>
            {showNotification && notificationMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
