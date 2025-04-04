/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { IconBell } from '@tabler/icons-react';
import { Divider, Indicator, Menu, MenuItem, Text, Title } from '@mantine/core';
import { useInventory } from '@/app/_utils/inventory-context';
import { Notification, OrderRequisition } from '@/app/_utils/schema';
import { fetchEmployee, fetchOrderRequisitions, patchEmployee } from '@/app/_utils/utility';
import classnames from './Bell.module.css';

export default function Bell() {
  const [allOrs, setAllOrs] = useState<OrderRequisition[]>([]);
  const [disabled, setDisabled] = useState(true);
  const [disabled0, setDisabled0] = useState(false);
  const [disabled1, setDisabled1] = useState(false);
  const [disabled2, setDisabled2] = useState(false);
  const [disabled3, setDisabled3] = useState(false);
  const [disabled4, setDisabled4] = useState(false);
  const { currentEmployee } = useInventory();

  useEffect(() => {
    async function retrieveRequisition() {
      try {
        await fetchOrderRequisitions(setAllOrs);
      } catch (error) {
        console.log(error);
      }
    }
    retrieveRequisition();
  }, []);

  const sortedOrs = sortOrders(allOrs);

  function sortOrders(reqOrders: OrderRequisition[]): OrderRequisition[] {
    reqOrders?.sort((a, b) => {
      const dateA = new Date(a.requisitionDate);
      const dateB = new Date(b.requisitionDate);
      //convert to false boolean if date field is null
      const isValidDateA = !isNaN(dateA.getTime());
      const isValidDateB = !isNaN(dateB.getTime());

      // Both dates invalid they are equal
      if (!isValidDateA && !isValidDateB) {
        return 0;
      }

      // Only 'a' date invalid, return 1, B is shifted toward start of array
      if (!isValidDateA) {
        return 1;
      }

      // Only 'b' date invalid,  return -1, A is shifted toward start of array
      if (!isValidDateB) {
        return -1;
      }

      // if a and b are not the same, is A active true? then move A toward start of array else move b
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }

      // Sort by date, most recent first
      // if b-a is positive, move b towards start of array
      // if b-a is negative, move a towards start of array
      // if b-a is 0, neither move
      return dateB.getTime() - dateA.getTime();
    });
    console.log(reqOrders);
    return reqOrders;
  }

  function sortNotifications(reqOrders: Notification[]): Notification[] {
    reqOrders?.sort((a, b) => {
      const dateA = new Date(a.requisitionDate);
      const dateB = new Date(b.requisitionDate);
      //convert to false boolean if date field is null
      const isValidDateA = !isNaN(dateA.getTime());
      const isValidDateB = !isNaN(dateB.getTime());

      // Both dates invalid they are equal
      if (!isValidDateA && !isValidDateB) {
        return 0;
      }

      // Only 'a' date invalid, return 1, B is shifted toward start of array
      if (!isValidDateA) {
        return 1;
      }

      // Only 'b' date invalid,  return -1, A is shifted toward start of array
      if (!isValidDateB) {
        return -1;
      }

      // Sort by date, most recent first
      // if b-a is positive, move b towards start of array
      // if b-a is negative, move a towards start of array
      // if b-a is 0, neither move
      return dateB.getTime() - dateA.getTime();
    });
    return reqOrders;
  }

  // take only the first five requisition and put in a new array
  const notificationArr5 = sortedOrs?.slice(0, 5) || [];
  //use map function to take reqids only and put in a new array
  function mapReqId(orderrequisitions: OrderRequisition[]): Notification[] {
    return orderrequisitions.map((obj) => ({
      reqId: obj.requisitionId,
      reqType: obj.requisitionType,
      reqTypeId: obj.requisitionTypeId,
      requisitionDate: obj.requisitionDate,
    }));
  }
  //use map function to take Notfication properties only and put in a new array
  const newestNotificationArr = mapReqId(notificationArr5);

  // update the employee notification array, if updated successfully remove bell red dot.
  async function clickBell() {
    if (currentEmployee) {
      try {
        const selectedEmployee = await fetchEmployee(currentEmployee.employeeId); // Fetch the employee data
        // Usage
        if (areArraysEqual(selectedEmployee.notifications, newestNotificationArr)) {
          setDisabled(true);
        } else {
          setDisabled(false);
        }
        if (currentEmployee.notifications !== undefined) {
          for (let i = 0; i < 5; i++) {
            console.log(selectedEmployee.notifications[i]);
            if (
              selectedEmployee.notifications.some(
                (n: Notification) => n?.reqId === newestNotificationArr[i]?.reqId
              )
            ) {
              switch (i) {
                case 0:
                  setDisabled0(true);
                  break;
                case 1:
                  setDisabled1(true);
                  break;
                case 2:
                  setDisabled2(true);
                  break;
                case 3:
                  setDisabled3(true);
                  break;
                case 4:
                  setDisabled4(true);
                  break;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    }
  }

  //compare objects to determine if employee has check notifications
  //if false render the dot!
  function deepEqual(obj1: Notification, obj2: Notification): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      //This is known as bracket notation, which allows us to dynamically access the property value of an object using a string variable.
      if (obj1[key as keyof Notification] !== obj2[key as keyof Notification]) {
        return false;
      }
    }

    return true;
  }

  function areArraysEqual(
    arr1: Notification[] | undefined,
    arr2: Notification[] | undefined
  ): boolean {
    if (arr1 == null || arr2 == null) {
      console.log('One of the Arrays is null');
      console.log(arr1);
      console.log(arr2);
      return false;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      // if deep equal returns false, then return false
      if (!deepEqual(arr1[i], arr2[i])) {
        return false;
      }
    }

    return true;
  }
  // on page load fetch current employee from database as currentEmployee doesnt load in fast enough
  // use a deep check to compare the actual properties of the objects in the arrays
  useEffect(() => {
    const checkNotifications = async () => {
      if (currentEmployee) {
        try {
          const selectedEmployee = await fetchEmployee(currentEmployee.employeeId); // Fetch the employee data

          // Usage
          if (areArraysEqual(currentEmployee.notifications, newestNotificationArr)) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
          if (selectedEmployee.notifications !== undefined) {
            for (let i = 0; i < 5; i++) {
              console.log(selectedEmployee.notifications[i]);
              if (
                selectedEmployee.notifications.some(
                  (n: Notification) => n?.reqId === newestNotificationArr[i]?.reqId
                )
              ) {
                switch (i) {
                  case 0:
                    setDisabled0(true);
                    break;
                  case 1:
                    setDisabled1(true);
                    break;
                  case 2:
                    setDisabled2(true);
                    break;
                  case 3:
                    setDisabled3(true);
                    break;
                  case 4:
                    setDisabled4(true);
                    break;
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching employee:', error);
        }
      }
    };

    checkNotifications();
  }, [currentEmployee]);

  async function menuItemClick(reqId: string, newNotificationObj: Notification) {
    console.log(reqId);
    if (currentEmployee) {
      try {
        const selectedEmployee = await fetchEmployee(currentEmployee.employeeId);
        const currentEmpArray = selectedEmployee.notifications || [];

        if (!currentEmpArray.some((n: Notification) => n.reqId === newNotificationObj.reqId)) {
          const updatedArr1: Notification[] = [...currentEmpArray, newNotificationObj];
          const updatedArr2 = sortNotifications(updatedArr1);
          const updatedArr3 = updatedArr2.slice(0, 5);

          const updatedEmployee = { notifications: updatedArr3 };

          await patchEmployee(currentEmployee.employeeId, updatedEmployee);
          const selectedEmployee = await fetchEmployee(currentEmployee.employeeId);
          if (areArraysEqual(newestNotificationArr, updatedArr3)) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
          if (selectedEmployee.notifications !== undefined) {
            for (let i = 0; i < 5; i++) {
              if (
                selectedEmployee.notifications.some(
                  (n: Notification) => n.reqId === newestNotificationArr[i]?.reqId
                )
              ) {
                switch (i) {
                  case 0:
                    setDisabled0(true);
                    break;
                  case 1:
                    setDisabled1(true);
                    break;
                  case 2:
                    setDisabled2(true);
                    break;
                  case 3:
                    setDisabled3(true);
                    break;
                  case 4:
                    setDisabled4(true);
                    break;
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    }
  }

  const getIndicatorColor = (requisitionType: string) => {
    if (requisitionType === 'odor') {
      return '#228BE6'; // Red for 'odor'
    }

    return 'rgba(255, 0, 0, 1)'; // Blue for 'ror'
  };

  return (
    <>
      <Title className={classnames.Notifications}>
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <Indicator processing inline disabled={!!disabled} color="red" size={12}>
              <IconBell onClick={clickBell} size={35} stroke={1.5} />
            </Indicator>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              <Text size="lg">Notifications</Text>
            </Menu.Label>

            {sortedOrs ? (
              <>
                <MenuItem
                  onClick={() =>
                    menuItemClick(sortedOrs[0].requisitionId, newestNotificationArr[0])
                  }
                  className={classnames.MenuItem}
                >
                  <div className={classnames.outerNotifyDiv}>
                    <Indicator
                      offset={15}
                      position="top-center"
                      color={getIndicatorColor(sortedOrs[0]?.requisitionType)}
                      size={13}
                      className={classnames.OdorIndicator}
                    />
                    <div className={classnames.odorIDDiv}>
                      <Indicator offset={2} disabled={!!disabled0} color="red" size={6} />
                      <Text className={classnames.reqIdText}>
                        Requisition ID# {sortedOrs[0]?.requisitionId} has been created.
                      </Text>
                      <Text className={classnames.OdorIndicatorText}>
                        {sortedOrs[0]?.requisitionType} ID# {sortedOrs[0]?.requisitionTypeId}
                      </Text>
                    </div>
                  </div>
                </MenuItem>
                <Divider />

                <Menu.Item
                  onClick={() =>
                    menuItemClick(sortedOrs[1].requisitionId, newestNotificationArr[1])
                  }
                  className={classnames.MenuItem}
                >
                  <div className={classnames.outerNotifyDiv}>
                    <Indicator
                      offset={15}
                      position="top-center"
                      color={getIndicatorColor(sortedOrs[1]?.requisitionType)}
                      size={13}
                      className={classnames.OdorIndicator}
                    />
                    <div className={classnames.odorIDDiv}>
                      <Indicator offset={2} disabled={!!disabled1} color="red" size={6} />
                      <Text className={classnames.reqIdText}>
                        Requisition ID# {sortedOrs[1]?.requisitionId} has been created.
                      </Text>
                      <Text className={classnames.OdorIndicatorText}>
                        {sortedOrs[1]?.requisitionType} ID# {sortedOrs[1]?.requisitionTypeId}
                      </Text>
                    </div>
                  </div>
                </Menu.Item>
                <Divider />

                <Menu.Item
                  onClick={() =>
                    menuItemClick(sortedOrs[2].requisitionId, newestNotificationArr[2])
                  }
                  className={classnames.MenuItem}
                >
                  <div className={classnames.outerNotifyDiv}>
                    <Indicator
                      offset={15}
                      position="top-center"
                      color={getIndicatorColor(sortedOrs[2]?.requisitionType)}
                      size={13}
                      className={classnames.OdorIndicator}
                    />
                    <div className={classnames.odorIDDiv}>
                      <Indicator offset={2} disabled={!!disabled2} color="red" size={6} />
                      <Text className={classnames.reqIdText}>
                        Requisition ID# {sortedOrs[2]?.requisitionId} has been created.
                      </Text>
                      <Text className={classnames.OdorIndicatorText}>
                        {sortedOrs[2]?.requisitionType} ID# {sortedOrs[2]?.requisitionTypeId}
                      </Text>
                    </div>
                  </div>
                </Menu.Item>
                <Divider />

                <Menu.Item
                  onClick={() =>
                    menuItemClick(sortedOrs[3].requisitionId, newestNotificationArr[3])
                  }
                  className={classnames.MenuItem}
                >
                  <div className={classnames.outerNotifyDiv}>
                    <Indicator
                      offset={15}
                      position="top-center"
                      color={getIndicatorColor(sortedOrs[3]?.requisitionType)}
                      size={13}
                      className={classnames.OdorIndicator}
                    />
                    <div className={classnames.odorIDDiv}>
                      <Indicator offset={2} disabled={!!disabled3} color="red" size={6} />
                      <Text className={classnames.reqIdText}>
                        Requisition ID# {sortedOrs[3]?.requisitionId} has been created.
                      </Text>
                      <Text className={classnames.OdorIndicatorText}>
                        {sortedOrs[3]?.requisitionType} ID# {sortedOrs[3]?.requisitionTypeId}
                      </Text>
                    </div>
                  </div>
                </Menu.Item>
                <Divider />

                <Menu.Item
                  onClick={() =>
                    menuItemClick(sortedOrs[4].requisitionId, newestNotificationArr[4])
                  }
                  className={classnames.MenuItem}
                >
                  <div className={classnames.outerNotifyDiv}>
                    <Indicator
                      offset={15}
                      position="top-center"
                      color={getIndicatorColor(sortedOrs[4]?.requisitionType)}
                      size={13}
                      className={classnames.OdorIndicator}
                    />
                    <div className={classnames.odorIDDiv}>
                      <Indicator offset={2} disabled={!!disabled4} color="red" size={6} />
                      <Text className={classnames.reqIdText}>
                        Requisition ID# {sortedOrs[4]?.requisitionId} has been created.
                      </Text>
                      <Text className={classnames.OdorIndicatorText}>
                        {sortedOrs[4]?.requisitionType} ID# {sortedOrs[4]?.requisitionTypeId}
                      </Text>
                    </div>
                  </div>
                </Menu.Item>
              </>
            ) : (
              <Text />
            )}
          </Menu.Dropdown>
        </Menu>
      </Title>
    </>
  );
}
