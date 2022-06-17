export function estimateAuth (user: any) {
    let auth = "";
    if ((user.is_stu_admin && user.is_sch_admin) || user.is_super)
      auth = "double";
    else if (user.is_stu_admin && !user.is_sch_admin) auth = "stu-sole";
    else if ((user.is_sch_admin && !user.is_stu_admin) || user.is_sch_dis_admin)
      auth = "sch-sole";
    else auth = "user";
    return auth;
  };