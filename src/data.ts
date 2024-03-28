export const kanban = [
  {
    hashId: "Qwerty+1234",
    name: "Моя тестова дошка",
    boards: [
      {
        id: "1qwe",
        title: "ToDo",
        items: [
          {
            id: "1abc",
            title: "1 - Перша таска",
            description: "Треба зробити це таким чином",
          },
          {
            id: "2abc",
            title: "2 - Інша таска",
            description: "Треба зробити це таким чином",
          },
          {
            id: "3abc",
            title: "3 - Легка таска",
            description: "Треба зробити це таким чином",
          },
        ],
      },
      { id: "2qwe", title: "In Progress", items: [] },
      { id: "3qwe", title: "Done", items: [] },
    ],
  },
  {
    hashId: "1111",
    name: "1111",
    boards: [
      {
        id: "1qwewsdwf",
        title: "ToDo",
        items: [
          {
            id: "1adaabc",
            title: "1 - Перша таска",
            description: "Треба зробити це таким чином",
          },
        ],
      },
      { id: "2adfeqwe", title: "In Progress", items: [] },
      { id: "3qsdfwe", title: "Done", items: [] },
    ],
  },
];

export const initialKanban = [
  {
    id: "01",
    title: "ToDo",
    items: [
      {
        id: "1adaabc",
        title: "1 - Перша таска",
        description: "Треба зробити це таким чином",
      },
    ],
  },
  { id: "02", title: "In Progress", items: [] },
  { id: "03", title: "Done", items: [] },
];
