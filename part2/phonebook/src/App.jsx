import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import FilteredPerson from "./components/FilteredPerson";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const changeName = (event) => {
    setNewName(event.target.value);
  };

  const changeNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const changeFilter = (event) => {
    setFilterName(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (persons.find((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        personService.update(person.id, personObject).then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : returnedPerson)),
          );
          setNewName("");
          setNewNumber("");
          return;
        });
      }
    }
    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const filteredPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(filterName.toLowerCase());
  });

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} changeFilter={changeFilter} />
      <h2>Add a new</h2>
      <Form
        newName={newName}
        newNumber={newNumber}
        changeName={changeName}
        changeNumber={changeNumber}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      {filterName.length > 0 ? (
        <FilteredPerson persons={filteredPersons} deletePerson={deletePerson} />
      ) : (
        <Persons persons={persons} deletePerson={deletePerson} />
      )}
    </div>
  );
};

export default App;
