"use client";

import { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const DashboardPage: React.FC = () => {
  const [avatars, setAvatars] = useState<any[]>([]);
  const [avatarName, setAvatarName] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const getAvatars = async () => {
    const currAvatars = await axios.get("/api/avatar/list");
    console.log("response ", currAvatars);
    setAvatars(currAvatars?.data?.avatars);
  };
  useEffect(() => {
    getAvatars();
  }, []);

  const handleAvatarNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAvatarName(e.target.value);
  };

  const handleSystemPromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully.");
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };
  const handleViewAvatar = (avatarId: number) => {
    router.push(`/avatar/${avatarId}`);
  };

  const handleCreateAvatar = async () => {
    const resp = await axios.post("/api/avatar", {
      name: avatarName,
      description: systemPrompt,
    });
    console.log("resp ", resp);
  };
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Dashboard</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create a New Avatar
      </button>
      <h2 className="text-xl font-semibold my-4">List of Avatars</h2>
      <ul>
        {avatars.map((avatar) => (
          <li key={avatar._id} className="list-disc">
            {avatar.name}
            <button
              className="m-4"
              onClick={() => handleViewAvatar(avatar._id)}
            >
              view details
            </button>
          </li>
        ))}
      </ul>
      <div className="my-4">
        <label htmlFor="avatarName" className="block mb-2">
          Avatar Name:
        </label>
        <input
          type="text"
          id="avatarName"
          value={avatarName}
          onChange={handleAvatarNameChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="my-4">
        <textarea
          placeholder="AI avatar character - add the system prompt here"
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button className="m-4" onClick={handleCreateAvatar}>
        create avatar
      </button>
    </div>
  );
};

export default DashboardPage;
