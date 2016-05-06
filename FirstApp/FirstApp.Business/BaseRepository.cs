// ---------------------------------------------------------------------------
// Copyright (C) 2015 LT. All rights reserved.
// Author - Abdul Rahim
// Created Date -  14 March 2016
// Last Modified By - Abdul Rahim
// Last Modified Date -  14 March 2016
//
// This is a BaseRepository class for Declare common variable used in Current Project
//----------------------------------------------------------------------------
using FirstApp.DataAccess;

namespace FirstApp.Business
{
    public class BaseRepository
    {
        public DBAccess DBAccess { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        public BaseRepository()
        {
            DBAccess=new DBAccess();
        }
    }
}
