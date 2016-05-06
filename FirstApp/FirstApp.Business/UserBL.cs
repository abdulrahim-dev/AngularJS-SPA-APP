// ---------------------------------------------------------------------------
// Copyright (C) 2015 LT. All rights reserved.
// Author - Abdul Rahim
// Created Date -  14 March 2016
// Last Modified By - Abdul Rahim
// Last Modified Date -  14 March 2016
//----------------------------------------------------------------------------
using System;
using FirstApp.Business.Repository;
using FirstApp.DataAccess;
using FirstApp.ModelLibrary;

namespace FirstApp.Business
{
    public class UserBL : BaseRepository,IUserBL
    {
        public bool Login(LoginModel loginModel)
        {
            return DBAccess.Login(loginModel);
        }
    }
}
