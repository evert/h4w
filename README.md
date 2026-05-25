Homelab for workgroups
----------------------

I wanted a 'homepage' for various self-hosted services. There were a bunch of
existing offerings, but I was missing some personality and whimsy from them.

Not being a designer myself, I decided to make my own but copy from a favourite
windows era.

Screenshot
-----------

<img src="https://raw.githubusercontent.com/evert/hl4wg/refs/heads/main/screenshots/v0.1.0.png" alt="Screenshot of the homepage" />

Note: this screenshot has a network neighbourhood, which is unreleased because I don't know yet
what to do with the icons.

Getting started
----------------

### Node.js

```sh
# Clone this repo
git clone git@github.com:evert/hl4wg.git

# Go into the repository
cd hl4wg

# Install dependencies
npm install

# Run
npm start
```

### docker-compose

TODO

Changing icons, adding menu items, etc
--------------------------------------

This tool will by default load in the 'menu.json' file in the `data/` directory.

This is a menu file, that roughly has this structure:

```json
{
  "title": "Homelab for Workgroups",

  "items": [
    {
      "title": "Jellyfin",
      "icon": "/image/icons/homelab/jellyfin.png",
      "href": "https://jellyfin.example.com/"
    }

}
```

Take a look at the supplied icons on Github in the `frontend/image/icons` directory. You
can add your own icons, host them anywhere including on this service.

Providing an `icon` is optional. If it's omitted we will try to lowercase the title and
see if an icon with that name exists in `frontend/image/icons/homelab/[name.png]`.


Can you implement x / x doesn't work
------------------------------------

If something doesn't work or seems missing it's probably because I didn't build it!
A bunch of features are non-funtional and just decorative for now.

I'd _love_ to know what people would like to see, so please just [open issues](https://github.com/evert/h4w/issues/new) to request features or contribute using a pull request!


Credits
-------

* Microsoft for the inspiration and memories
* [Windows 3.1 System Font reproduction by BroDadi](https://fontstruct.com/fontstructions/show/2574998/system-font-from-windows-3-1)
* [MS Sans-serif raster reproduction by CTFonts](https://fontstruct.com/fontstructions/show/2096359/ms-sans-serif-1-1)
* [Windows 3.1 icon collection by mRB0](https://github.com/mRB0/many-windows-3.1-icons-in-png-format)
