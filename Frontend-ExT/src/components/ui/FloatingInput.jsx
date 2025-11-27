const FloatingInput = ({ label, type="text", onChange, required }) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full px-3 py-3 bg-white/10 text-white rounded-lg border border-white/40
                   focus:border-white/80 outline-none transition-all placeholder-transparent"
        placeholder={label}
      />

      <label
        className="absolute left-3 top-3 text-white/60 
                   peer-placeholder-shown:text-white/50 
                   peer-placeholder-shown:top-3
                   peer-placeholder-shown:text-base
                   peer-focus:-top-3 peer-focus:text-sm 
                   peer-focus:text-white transition-all"
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
