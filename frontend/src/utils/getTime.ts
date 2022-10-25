const getTime = (time: number) =>
  `${`${Math.floor(time / 60 / 60)}`.padStart(2, "0")} :
      ${`${Math.floor((time / 60) % 60)}`.padStart(2, "0")} : ${`${
    time % 60
  }`.padStart(2, "0")}`;

export default getTime;
