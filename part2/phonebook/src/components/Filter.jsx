const Filter = ({ filterName, changeFilter }) => {
  return (
    <div>
      filter shown with <input value={filterName} onChange={changeFilter} />
    </div>
  );
};

export default Filter;
