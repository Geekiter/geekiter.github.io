pnpm
- Official website
    - https://pnpm.io/
- Advantages
    - Fast
    - Efficient
        - Files in node_modules are copied or linked from a specific content-addressable storage repository.
    - Supports monorepos
        - Monorepo means that all the code of all projects is maintained in a single code version repository.
        - pnpm has built-in support for multiple packages in a single repository.
![image](https://github.com/Geekiter/blog-issue/assets/20443506/5b744a6a-551f-47df-a073-da9bcb50bff6)

- Differences from npm and yarn
    - npm3+ and yarn manage node_modules through a flattened way, which solves some problems of nested ways, but introduces the problem of ghost dependencies, and only one version of the same package will be promoted, and the rest of the versions will still be copied multiple times.
    - pnpm hard links from the global store to node_modules/.pnpm, and then organizes the dependency relationship between them through soft links.
