from eventbrite import Eventbrite
from tok import secret
import pprint


token = secret()
eventbrite = Eventbrite(token)
pp = pprint.PrettyPrinter(indent=4)
user = eventbrite.get_user()

# name, url, description, date,  image, *location (can be found in the expansion of venue)

# Date: 
# 10/16/2019

# Location: 
# Berkeley

# Price: 
# Radius: 
# 34

# Categories: 


def eb_api_query(*args):
    # dictionary keys of argument are the fields we care about
    arguments = {"location.address": "", "categories": "", "start_date.range_start" : ""}

    # do something like this...
    arguments["location.address"] = args[0]
    # YYYY-MM-DDThh:mm:ssZ
    arguments["start_date.range_start"] = args[2]
    arguments["categories"] = args[1]
    



    #this line is to expand the venue field (necessary to retrieve address)
    arguments["expand"] = "venue"

    results = eventbrite.event_search(**arguments)
    d = {}

    for i in range(len(results["events"])):
        name = (results["events"][i]["name"]["text"])
        sub_d = {}
        sub_d['url'] = results["events"][i]["url"]
        sub_d['description'] = results["events"][i]["description"]["text"]
        sub_d['date'] = results["events"][i]["start"]["local"]
        sub_d['image'] = results["events"][i]["logo"]["original"]["url"]        
        sub_d['location'] = results["events"][i]["venue"]["address"]["localized_multi_line_address_display"]        
        d[name] = sub_d.copy()
    return d
        # pp.pprint(results["events"][i]["url"])
        # pp.pprint(results["events"][i]["description"]["text"])
        # pp.pprint(results["events"][i]["start"]["local"])
        # pp.pprint(results["events"][i]["logo"]["original"]["url"])
        # pp.pprint(results["events"][i]["venue"]["address"]["localized_multi_line_address_display"])




   
   
    #populate this dictionary with info from the search


    #name, url, description, date,  image, *location
  

   


    

#eb_api_query()
