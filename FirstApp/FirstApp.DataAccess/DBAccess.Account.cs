// ---------------------------------------------------------------------------
// Copyright (C) 2015 LT. All rights reserved.
// Author - Abdul Rahim
// Created Date -  14 March 2016
// Last Modified By - Abdul Rahim
// Last Modified Date -  14 March 2016
//
// Used for inser/update/select data from DB using Linq.
// It is created as a partial class.
//----------------------------------------------------------------------------

using System.Linq;
using FirstApp.DomainObjects;
using FirstApp.ModelLibrary;

namespace FirstApp.DataAccess
{
    public partial class DBAccess
    {
        public bool Login(LoginModel loginModel)
        {
            using (var dbEntities = new DB_FirstAppEntities())
            {
                Tb_User user =dbEntities.Tb_User.FirstOrDefault(x => x.UserName == loginModel.UserName && x.Password == loginModel.Password);
                if (user!=null)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
