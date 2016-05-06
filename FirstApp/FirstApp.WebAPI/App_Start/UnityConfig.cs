using Microsoft.Practices.Unity;
using System.Web.Http;
using FirstApp.Business;
using FirstApp.Business.Repository;
using Unity.WebApi;

namespace FirstApp.WebAPI
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();
            container.RegisterType<IUserBL, UserBL>();
            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}