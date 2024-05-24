# Structure of the main library of JClic projects

Projects are hosted in:<br/>
https://clic.xtec.cat/projects

Each project has a subdirectory in this root structure. For example, the "demo" project is located in:<br/>
https://clic.xtec.cat/projects/demo

Some projects can have subprojects. For example, the "cs18" module of the [Andrómeda](https://projectes.xtec.cat/clic/ca/repo/?text=andr%C3%B3meda&subject=soc) (codename "androcs") project resides in:<br/>
https://clic.xtec.cat/projects/androcs/cs18

The full list of projects is always here:<br/>
https://clic.xtec.cat/projects/projects.json

This list is an array of objects. The main fields of these objects are:

- __id__: Numeric identifier of this project in the library.
- __path__: The subirectory of the root repository where this project resides, as previously seen.
- __title__: The main title of the project
- __author__: The author or authors of this project, separed by comma.
- __date__: The publication date, in format `DD/MM/YY`.
- __langCodes__: An array of [ISO-639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) two-letter language codes.
- __levelCodes__: An array of one or more tags from this list of possible values:
  - __INF__: Kindergarten (3-6)
  - __PRI__: Primary school (6-12)
  - __SEC__: Secondary school (12-16)
  - __BTX__: High school (16-18)
- __areaCodes__: An array of one or more tags from this list of possible values:
  - __lleng__: Languages
  - __mat__: Mathematics
  - __soc__: Social sciences
  - __exp__: Experimental sciences
  - __mus__: Music
  - __vip__: Art & design
  - __ef__: Physical education
  - __tec__: Design & technology
  - __div__: Miscellaneous
- __mainFile__: The main ".jclic" (XML) or ".jclic.json" file, used by [JClic.js](https://projectestac.github.io/jclic.js/) to launch this project. The path of this file is always relative to the location of the project.
- __cover__: The cover image of this project, usually at 300 pixels width, in PNG or JPG format.
- __coverWebp__: The same cover, in [WebP](https://en.wikipedia.org/wiki/WebP) format.
- __thumbnail__: Small version of the cover image, usually at 100 pixels width.

This is a just a short version of the metadata of each project. The full metadata is located in a file named `project.json`, at the root of the project subdirectory. For example, for the "demo" project:<br/>
https://clic.xtec.cat/projects/demo/project.json

In addition to the fields described above, the "project.json" file contains this information:
- __meta_langs__: List of [ISO-639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) language codes used in the metadata. They are usually Catalan (`ca`), Spanish (`es`) and English (`en`).
- __school__: Name of the school where the project was created.
- __languages__, __areas__ and __levels__: Translation of the meaning of the _langCodes_, _areaCodes_ and _levelCodes_ fields into all metadata languages.
- __descriptors__: Additional metadata tags separed by commas, also provided in all metadata languages.
- __descCodes__: Arbitrary numeric codes used by the application, related to _descriptors_.
- __description__: Main descriptions of this JClic project, in all metadata languages. This field may contain line breaks and HTML codes.
- __license__: License of use granted by the authors of the project. It is usually of type [Creative Commons BY-SA-NC](https://creativecommons.org/licenses/by-nc-sa/4.0/).
- __relatedTo__: Optional field with an array of other project paths related to this one.
- __zipFile__ and __instFile__: Files used by the original [JClic Java app](https://projectestac.github.io/jclic/).
- __clicZoneId__, __clicZoneURL__ and __clicZoneAppletURL__: Optional fields related to the publication of this project on the old JClic site. Currently unused.
- __activities__: Number of JClic activities included in this project.
- __mediaFiles__: Number of images, sounds, videos and other media files used in this project.
- __totalSize__: Total size of this project in bytes.
- __files__: Comprehensive list of all files that are part of the project.

In addition to the `project.json` file, there is also another metadata file named `all-words.txt`.  This file contains all the words that appear both in the activities and in the project description, separated by whitespaces. For example:<br/>
https://clic.xtec.cat/projects/demo/all-words.txt<br/>
WARNING: This file is encoded in UTF-8. You may see incorrect characters if you open it with a web browser, as it usually defaults to ISO-8859 encoding.

The complete list of all projects with all their fields, including the contents of the `all-words.txt` file, is available in [this spreadsheet](https://docs.google.com/spreadsheets/d/1mf2PdYnTkh-J1toqM7a8QKEsJj98A7ydPHGo7IUAi3w/edit?usp=sharing).

The main web page of the repository is available in three languages: Catalan (ca), Spanish (es) and English (en) at:<br/>
https://projectes.xtec.cat/clic/ca/repo<br/>
https://projectes.xtec.cat/clic/es/repo<br/>
https://projectes.xtec.cat/clic/en/repo<br/>

The URL of the page corresponding to each project is formed by adding `?prj=path` to these URLs. For example, the "demo" project will be displayed at the URLs:<br/>
https://projectes.xtec.cat/clic/ca/repo/?prj=demo<br/>
https://projectes.xtec.cat/clic/es/repo/?prj=demo<br/>
https://projectes.xtec.cat/clic/en/repo/?prj=demo<br/>
