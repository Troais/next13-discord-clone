import { redirect } from "next/navigation";
import { useState } from "react";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <ServerCreationModal profileId={profile.id} />;
}

const ServerCreationModal = ({ profileId }) => {
  const [serverName, setServerName] = useState('');
  const [serverImageUrl, setServerImageUrl] = useState('');

  const handleCreateServer = async () => {
    try {
      const response = await fetch('/api/server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: serverName,
          imageUrl: serverImageUrl,
          profileId: profileId,
        }),
      });

      if (!response.ok) {
        throw new Error('Server creation failed');
      }

      const data = await response.json();
      console.log('Server created successfully:', data);
      // Redirect to the new server page
      redirect(`/servers/${data.id}`);
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  return (
    <div>
      <h1>Customize your server</h1>
      <input
        type="text"
        placeholder="Server Name"
        value={serverName}
        onChange={(e) => setServerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={serverImageUrl}
        onChange={(e) => setServerImageUrl(e.target.value)}
      />
      <button onClick={handleCreateServer}>Create</button>
    </div>
  );
};

export default SetupPage;
