import React from 'react'
import styles from './Prompt.module.css'


import Logos from './Logos'

import { Button } from '@mantine/core';
import { Group, Avatar, Text, Accordion } from '@mantine/core';

// const details = {
//   id: 'bender2',
//   image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
//   headline: 'YourApp by YourAppOwner',
//   subline: 'wants to access PersonalAppXAccount',
//   perms: "Bender Bending Rodríguez, (born September 4, 2996), designated Bending Unit 22, and commonly known as Bender, is a bending unit created by a division of MomCorp in Tijuana, Mexico, and his serial number is 2716057. His mugshot id number is 01473. He is Fry's best friend.",
// }


export default function ListEntry() {
  return (
    <div className={styles.ListEntry}>
      <div className={styles.logoSmol}>
        <img src="" className={styles.imgg}></img>
      </div>
      <div className={styles.text}>
        <p className={styles.headline}>YourApp by YourAppOwner</p>
        <p className={styles.subline}>wants to access your PersonalAppXAccount</p>
      </div>
    </div>
  )
}


function Logos(props) {
  return (
      <div className={styles.Logos}>
          <div className={styles.logoPack}>
              <div className={styles.logo}>
                  <img src={props.appLogo}></img>
              </div>
              <div className={styles.link}></div>
              <div className={styles.logo}>
                  <img src={props.accountLogo}></img>
              </div>
          </div>
      </div>
  )
}

function AccordionLabel({ headline, subline, image, perms }) {
  return (
    <Group noWrap>
      <Avatar src={image} radius="xl" size="md" />
      <div>
        <Text>{headline}</Text>
        <Text size="sm" color="dimmed" weight={400}>{subline}</Text>
      </div>
    </Group>
  );
}
function permissionsElement(props) {
  return (
    <>
      {props.permissions.map(permission => (
        <li key={permission}>{permission}</li>
      ))}
    </>
  );
}
function ListEntry(props) {
  if (props.isExpandable == false) {
    let details = {
      headline: `${props.guestApp.name} by ${props.guestApp.owner}`,
      subline: `wants to access your ${props.accountAppX.name}`,
      image: `${props.guestApp.logoUrl}`,
      id: "none"
    }
    return <Accordion chevron="" variant="contained">
      <Accordion.Item value={details.id} key={details.headline}>
        <Accordion.Control>
          {/* // permissions go here */}
          <AccordionLabel {...details} />
        </Accordion.Control>
      </Accordion.Item>
    </Accordion>;
  } else {
    console.log(props)
    let details = {
      headline: `Personal User Data`,
      subline: `click to view requested permissions`,
      image: `${props.accountAppX.logoUrl}`,
      id: "none"
    }
    return <Accordion chevronPosition="right" variant="contained">
      <Accordion.Item value={details.id} key={details.headline}>
        <Accordion.Control>
          <AccordionLabel {...details} />
        </Accordion.Control>
        {/* const items = details.map((item) => ( */}
        <Accordion.Panel>
          <Text size="sm">
            {/* text{"\n"}tet */}
            {/* <permissionsElement permissions={props.permissions}/> */}
            <>
              {props.permissions.map(permission => (
                <p className={styles.permissions}key={permission}>{permission}</p>
              ))}
            </>
          </Text>
          {/* <permissionsElement permissions={props.permissions} /> */}
        </Accordion.Panel>
        {/* )); */}
      </Accordion.Item>
    </Accordion>;
  }
}

export default function Prompt(props) {
  function handleCancel() {
    alert("you clicked calcel")
  }
  function handleAuthorize() {
    alert("you clicked authorize")
  }
  return (
    <div className={styles.Prompt}>
      <Logos appLogo={props.guestApp.logoUrl} accountLogo={props.accountAppX.logoUrl}/>
      <p className={styles.heading}>Authorize {props.guestApp.name}</p>
      <div>
        {/* <ListEntry /> */}
        <ListEntry isExpandable={false} guestApp={props.guestApp} accountAppX={props.accountAppX} />
        <ListEntry isExpandable={true} permissions={props.permissions} guestApp={props.guestApp} accountAppX={props.accountAppX} />
      </div>
      <div className={styles.buttons}>
        <Button className={styles.button} onClick={handleCancel}>Cancel</Button>
        <Button className={styles.button} onClick={handleAuthorize}>Authorize</Button>
      </div>
    </div>
  )
}
