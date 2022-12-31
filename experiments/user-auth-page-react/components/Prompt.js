import React from 'react'
import styles from './Prompt.module.css'

import Logos from './Logos'
// import ListEntry from './ListEntry'

import { Button } from '@mantine/core';
import { Group, Avatar, Text, Accordion } from '@mantine/core';

const charactersList = {
  id: 'bender2',
  image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
  label: 'Bender Bending Rodríguez',
  description: 'Fascinated with cooking, though has no sense of taste',
  content: "Bender Bending Rodríguez, (born September 4, 2996), designated Bending Unit 22, and commonly known as Bender, is a bending unit created by a division of MomCorp in Tijuana, Mexico, and his serial number is 2716057. His mugshot id number is 01473. He is Fry's best friend.",
}


function AccordionLabel({ label, image, description, content }) {
  return (
    <Group noWrap>
      <Avatar src={image} radius="xl" size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" color="dimmed" weight={400}>{description}</Text>
      </div>
    </Group>
  );
}

function ListEntry(props) {
  if (props.isExpandable == false) {
    return <Accordion chevron="" variant="contained">
      <Accordion.Item value={charactersList.id} key={charactersList.label}>
        <Accordion.Control>
          <AccordionLabel {...charactersList} />
        </Accordion.Control>
      </Accordion.Item>
    </Accordion>;
  } else {
    return <Accordion chevronPosition="right" variant="contained">
      <Accordion.Item value={charactersList.id} key={charactersList.label}>
        <Accordion.Control>
          <AccordionLabel {...charactersList} />
        </Accordion.Control>
        {/* const items = charactersList.map((item) => ( */}
        <Accordion.Panel>
          <Text size="sm">{charactersList.content}</Text>
        </Accordion.Panel>
        {/* )); */}
      </Accordion.Item>
    </Accordion>;
  }
}

export default function Prompt() {
  function handleCancel() {
    alert("you clicked calcel")
  }
  function handleAuthorize() {
    alert("you clicked authorize")
  }
  return (
    <div className={styles.Prompt}>
      <Logos />
      <p className={styles.heading}>Authorize YourApp</p>
      <div>
        {/* <ListEntry /> */}
        <ListEntry isExpandable={false} />
        <ListEntry isExpandable={true} />
      </div>
      <div className={styles.buttons}>
        <Button className={styles.button} onClick={handleCancel}>Cancel</Button>
        <Button className={styles.button} onClick={handleAuthorize}>Authorize</Button>
      </div>
    </div>
  )
}
