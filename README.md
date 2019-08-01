# React Lab

### Local Develoment

1. Clone the repo
2. Navigate to the repo 
3. Run `npm link` to link the package globally
4. Navigate to a react component's directory 
5. Run `lab ComponentFileName`

## Known Issues

- It will not work for components that expect a Provider to be above them in the tree
- It will not work (probably) for components that import stylesheets
- It will not work (probably) for components that import images of any type other than svg or png
- It will not work (probably) for components that require specialized or custom webpack loaders
