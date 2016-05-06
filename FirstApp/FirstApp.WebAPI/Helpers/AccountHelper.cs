using System;
using System.Web;
using FirstApp.ModelLibrary;
using FirstApp.WebAPI.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace FirstApp.WebAPI.Helpers
{
    public static class AccountHelper
    {
        
        public static string SeedUser(RegisterModel registerDetails)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = new ApplicationUser()
            {
                UserName = registerDetails.UserName,
                Email = registerDetails.Email
            };
            userManager.Create(user, registerDetails.Password);
            //userManager.SetLockoutEnabled(user.Id, false);
            //userManager.AddToRole(user.Id, "User");
            return user.Id;
        }
    }

  
}