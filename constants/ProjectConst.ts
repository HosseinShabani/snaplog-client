export type ProjectT = {
  name:string;
  createdAt: string;
  id:number;
  status:number
}

type ProjectConstT = {
  data: ProjectT[]
}

const ProjectConst:ProjectConstT  = {
  data:[
    {
      name:'Project 1',
      createdAt:"Jun 17, 2024",
      id:1 ,
      status: 1
    },
     {
      name:'Project 2',
      createdAt:"Jun 17, 2024",
      id:2 ,
      status: 1
    }, {
      name:'Project 3',
      createdAt:"Jun 17, 2024",
      id:3 ,
      status: 1
    }, {
      name:'Project 4',
      createdAt:"Jun 17, 2024",
      id:4 ,
      status: 2
    },
     {
      name:'Project 5',
      createdAt:"Jun 17, 2024",
      id:5 ,
      status: 3,
    }, {
      name:'Project 6',
      createdAt:"Jun 17, 2024",
      id:6 ,
      status: 4
    }
  ],
}

export {ProjectConst}