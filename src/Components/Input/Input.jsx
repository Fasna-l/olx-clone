const Input = (props) => {
  const {
    setInput,
    placeholder,
    error,
    type = "text",
  } = props;

  const inputId = placeholder
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div className="pt-2 w-full relative">

      <input
        onChange={(event) => {
          setInput(event.target.value);
        }}
        type={type}
        id={inputId}
        placeholder=" "
        className={`w-full border-2 rounded-md p-3 pt-4 pb-2 focus:outline-none peer ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-black focus:border-teal-500"
        }`}
      />

      <label
        htmlFor={inputId}
        className="absolute pl-1 pr-1 left-2.5 top-0 bg-white text-sm
        peer-focus:top-0
        peer-focus:text-sm
        transition-all
        duration-200
        peer-placeholder-shown:text-base
        peer-placeholder-shown:top-5"
      >
        {placeholder}
      </label>

      {/* Inline validation error */}
      {error && (
        <p
          className="text-red-500 text-sm mt-1 mb-1"
          role="alert"
        >
          {error}
        </p>
      )}

    </div>
  );
};

export default Input;

