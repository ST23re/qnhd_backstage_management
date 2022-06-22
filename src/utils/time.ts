function returnCompleteTime(date: Date) {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      (`${date.getDate() < 10 ? '0' : ''}` + date.getDate()) +
      ' ' +
      (`${date.getHours() < 10 ? '0' : ''}` + date.getHours()) +
      ':' +
      (`${date.getMinutes() < 10 ? '0' : ''}` + date.getMinutes()) +
      ':' +
      (`${date.getSeconds() < 10 ? '0' : ''}` + date.getSeconds())
    );
  }
export default function timeFromNow(inputTime: string) {
    let now = new Date(),
      past = new Date(inputTime);
    let gap = now.getTime() - past.getTime();
    let dDays = Math.floor(gap / (24 * 3600 * 1000));
    let residue1 = gap % (24 * 3600 * 1000);
    let dHours = Math.floor(residue1 / (3600 * 1000));
    let residue2 = residue1 % (3600 * 1000);
    let dMinutes = Math.floor(residue2 / (60 * 1000));
    let residue3 = residue2 % (60 * 1000);
    let dSeconds = Math.round(residue3 / 1000);
    return dDays > 0
      ? returnCompleteTime(past)
      : dHours > 0
      ? `${dHours}小时${dMinutes}分钟前`
      : dMinutes > 0
      ? `${dMinutes}分钟前`
      : `${dSeconds}秒前`;
  }