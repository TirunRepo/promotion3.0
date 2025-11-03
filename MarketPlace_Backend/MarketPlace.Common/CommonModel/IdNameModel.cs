using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.CommonModel
{
    public class IdNameModel<T>
    {
        public T Id { get; set; }
        public string Name { get; set; }
    }

    public class IdNameValueModel<T>
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public T Value { get; set; }
    }
}
