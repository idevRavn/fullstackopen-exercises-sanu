import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import FilteredPerson from "./components/FilteredPerson";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(persons.concat(response.data));
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
    if (persons.find((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const personObject = {
      name: newName,
      number: newNumber,
    };
    axios
      .post("http://localhost:3001/persons", personObject)
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
      });
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
        <FilteredPerson persons={filteredPersons} />
      ) : (
        <Persons persons={persons} />
      )}
    </div>
  );
};

export default App;
