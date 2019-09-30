// import {expect} from "chai"
// import {join} from "path"
//
// const packagePath = join(__dirname, "..")
//
// describe("atom-typescript", function() {
//   this.timeout(8000)
//
//   it("should activate", async () => {
//     const packages = atom.packages
//
//     // Load package, but it won't activate until the TypeScript grammar is used
//     const promise = atom.packages.activatePackage(packagePath)
//
//     packages.triggerActivationHook("substrate-plugin:rust")
//     packages.triggerDeferredActivationHooks()
//
//     await promise
//
//     expect(atom.packages.isPackageActive("substrate-plugin")).to.equal(true)
//   })
// })
