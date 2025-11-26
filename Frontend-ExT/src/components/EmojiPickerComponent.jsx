import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Image, X } from "lucide-react";

const EmojiPickerComponent = ({ selectedEmoji, onSelect }) => {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  // Handle choosing an emoji
  const handleEmojiClick = (emojiObject) => {
    onSelect(emojiObject.emoji);
    setOpen(false);
  };

  return (
    <div className="relative inline-block " ref={pickerRef}>

      {/* Emoji button */}
      <div
        onClick={() => setOpen(!open)}
        className="w-20 p-2 border border-gray-200 rounded-lg text-center 
                   text-2xl cursor-pointer bg-white 
                   hover:bg-purple-100 hover:border-purple-500 transition flex items-center justify-center"
      >
        {selectedEmoji ? (
          selectedEmoji
        ) : (
          <Image className="w-6 h-6 text-purple-500 " />
        )}
      </div>

      {/* Popup opens BESIDE icon */}
      {open && (
        <div
          className="absolute z-50 top-0 left-full ml-3 shadow-xl border rounded-xl 
                     bg-white p-2"
        >
          {/* Popup Header */}
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm font-medium">Pick an Emoji</span>

            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-md 
                         hover:bg-gray-200 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Emoji Picker */}
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            height={380}
            width={300}
            skinTonesDisabled={false}   // ENABLE SKIN TONE SELECTOR
            lazyLoadEmojis={true}
            previewConfig={{ showPreview: true }}
            skinTonesLabel={"Skin Tone"}  // optional
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;
