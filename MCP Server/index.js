#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/server";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API = process.env.API_BASE_URL;

// Create MCP server over stdio
const server = new Server({
  name: "studymate-mcp",
  version: "1.0.0",
});

/* --------------------------------------------------
   TOOL: list_notes
   Returns all notes from your Express API
-------------------------------------------------- */
server.tool("list_notes", async () => {
  const res = await axios.get(`${API}/notes`);
  return res.data;
});

/* --------------------------------------------------
   TOOL: add_note
   Claude can create a new note
-------------------------------------------------- */
server.tool("add_note", async ({ title, subject, content }) => {
  const res = await axios.post(`${API}/notes`, {
    title,
    subject,
    content,
  });
  return res.data;
});

/* --------------------------------------------------
   TOOL: summarize_note
   Claude can summarize a note using your AI route
-------------------------------------------------- */
server.tool("summarize_note", async ({ id }) => {
  const res = await axios.post(`${API}/notes/${id}/summarize`);
  return res.data;
});

/* --------------------------------------------------
   Start MCP server over stdio
-------------------------------------------------- */
server.start();
