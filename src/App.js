import React, { useState, useEffect } from "react";

import Section from "./Components/Section/Section";
import ContactForm from "./Components/ContactForm/ContactForm";
import Contacts from "./Components/Contacts/Contacts";
import transition from "styled-transition-group";

const Div = transition.div.attrs({
  unmountOnExit: true,
  mountOnEntry: true,
  timeout: 250,
})`
position: absolute;
padding: 5px 10px;
width: 300px;

top: 10px;
left: 10px;

background-color: #6368e5;
border-radius: 8px;

text-align: center;
color: white;

  &:enter { opacity: 0; 
    transform: translateX(-100%); }
  &:enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  &:exit { opacity: 1;
  transform: translateX(0); }
  &:exit-active {
    opacity: 0;
    transform: translateX(-100%);
    transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(``);

  useEffect(() => {
    const persistedContacts = localStorage.getItem("contacts");
    if (persistedContacts) {
      setContacts(JSON.parse(persistedContacts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  });

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  }, [error]);

  const addContact = (objContact) => {
    const { name } = objContact;
    if (!name) {
      return;
    }
    if (contacts.every((contact) => !contact.name.includes(name))) {
      setContacts((prev) => [...prev, objContact]);
    } else setError(`${name} is already in contacts!`);
  };

  const deleteContact = (idContact) => {
    setContacts((prev) => [
      ...prev.filter((contact) => contact.id !== idContact),
    ]);
  };
  const addFilter = (query) => {
    setFilter(query);
  };
  const getFilter = () => filter;

  const filtredContacts = () => {
    if (filter.length > 0) {
      return contacts.filter((contact) =>
        contact.name.toLowerCase().includes(filter.toLowerCase())
      );
    } else return contacts;
  };

  return (
    <>
      {
        <Div in={error}>
          <p>{error}</p>
        </Div>
      }
      <Section title={"Phonebook"}>
        <ContactForm OnAddContact={addContact} />
      </Section>
      <Section title={"Contacts"}>
        <Contacts
          contacts={filtredContacts}
          OnDeleteContact={deleteContact}
          OnAddFilter={addFilter}
          OnGetFilter={getFilter}
        />
      </Section>
    </>
  );
};

export default App;
