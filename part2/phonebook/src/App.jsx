import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import FilteredPerson from "./components/FilteredPerson";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [notifyMessage, setNotifyMessage] = useState({
    type: "",
    message: null,
  });

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch(() => {
        setNotifyMessage({
          type: "error",
          message: "Failed to fetch persons",
        });
      });
  }, []);

  useEffect(() => {
    if (notifyMessage?.message) {
      const timer = setTimeout(() => {
        setNotifyMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifyMessage?.message]);

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
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        personService
          .update(existingPerson.id, personObject)
          .then((returnedPerson) => {
            setNotifyMessage({
              type: "success",
              message: `Updated ${newName}'s number`,
            });
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson,
              ),
            );
            setNewName("");
            setNewNumber("");
          })
          .catch(() => {
            setNotifyMessage({
              type: "error",
              message: `Failed to update ${newName}`,
            });
          });
      }
    } else {
      setNotifyMessage({
        type: "success",
        message: `Added ${newName}`,
      });
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
        })
        .catch(() => {
          setNotifyMessage({
            type: "error",
            message: `Failed to add ${newName}`,
          });
        });
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      setNotifyMessage({
        type: "success",
        message: `Deleted ${person.name}`,
      });
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch(() => {
          setNotifyMessage({
            type: "error",
            message: `Failed to delete ${person.name}`,
          });
        });
    }
  };

  const filteredPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(filterName.toLowerCase());
  });

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        type={notifyMessage?.type}
        message={notifyMessage?.message}
      />
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
