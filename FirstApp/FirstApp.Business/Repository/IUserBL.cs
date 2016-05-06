// ---------------------------------------------------------------------------
// Copyright (C) 2015 LT. All rights reserved.
// Author - Abdul Rahim
// Created Date -  14 March 2016
// Last Modified By - Abdul Rahim
// Last Modified Date -  14 March 2016
//----------------------------------------------------------------------------

using FirstApp.ModelLibrary;

namespace FirstApp.Business.Repository
{
    public interface IUserBL
    {
        bool Login(LoginModel loginModel);
    }
}
