import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  findNotes,
  getAllNotes,
  newNote,
  removeAllNotes,
  removeNotes,
} from "./notes";

const listNotes = (notes: Note[]) => {
  notes.forEach((note) => {
    console.log("\n");
    console.log("id: ", note.id);
    console.log("tags: ", note.tags);
    console.log("content: ", note.content);
  });
};

yargs(hideBin(process.argv))
  .command(
    "new <note>",
    "create a new note",
    (yargs) => {
      return yargs.positional("note", {
        describe: "The content of the note you want to create",
        type: "string",
      });
    },
    async (argv) => {
      const tags = typeof argv.tags === "string" ? argv.tags.split(",") : [];

      if (argv.note) {
        const note = await newNote(argv.note, tags);
        console.log("New note! ", note);
      }
    },
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "tags to add to the note",
  })
  .command(
    "all",
    "get all notes",
    () => {},
    async () => {
      const notes = await getAllNotes();
      listNotes(notes);
    },
  )
  .command(
    "find <filter>",
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {
      if (!argv.filter) return console.log("no filter provided");
      const notes = await findNotes(argv.filter);
      listNotes(notes);
    },
  )
  .command(
    "remove <id>",
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "The id of the note you want to remove",
      });
    },
    async (argv) => {
      if (!argv.id) return console.log("no id provided");
      const removedId = await removeNotes(argv.id);
      console.log("removed entry: ", removedId);
    },
  )
  .command(
    "web [port]",
    "launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "port to bind on",
        default: 5000,
        type: "number",
      });
    },
    async (argv) => {},
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    async () => {
      await removeAllNotes();
    },
  )
  .demandCommand(1)
  .parse();
