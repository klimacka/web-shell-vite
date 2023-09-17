import React, { FC, useEffect, useState } from "react";
import { Counter } from "../../components/_/Counter";

export const Page: FC = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:1333/api/team-members")
      // .then((res) => res.json())
      // .then((data) => {
      //   setTeamMembers(data);
      // })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <h1>Welcome to Admin</h1>
      This page is:
      <ul>
        <li>Rendered in browser.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <h2>Team Members</h2>
      <ul>
        {teamMembers.map((teamMember) => (
          <li key={teamMember.id}>{teamMember.Name}</li>
        ))}
      </ul>
    </>
  );
};
