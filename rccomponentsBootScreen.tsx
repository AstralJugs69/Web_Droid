[1mdiff --git a/src/components/BootScreen.tsx b/src/components/BootScreen.tsx[m
[1mindex 00f05aa..e16d7a9 100644[m
[1m--- a/src/components/BootScreen.tsx[m
[1m+++ b/src/components/BootScreen.tsx[m
[36m@@ -16,12 +16,12 @@[m [mconst BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {[m
   }, [onBootComplete]);[m
 [m
   return ([m
[31m-    <div className="absolute inset-0 bg-surface-dim z-50 flex flex-col items-center justify-center text-on-primary">[m
[31m-      <h1 className="text-4xl font-bold mb-4">WebDroid</h1>[m
[32m+[m[32m    <div className="absolute inset-0 bg-surface-dim z-50 flex flex-col items-center justify-center text-on-surface">[m
[32m+[m[32m      <h1 className="text-4xl font-bold mb-4 animate-boot-title">WebDroid</h1>[m
       <div className="h-1 w-32 bg-surface-variant rounded overflow-hidden">[m
         <div className="bg-primary h-full progress-bar-animation"></div>[m
       </div>[m
[31m-      <div className="text-sm mt-4">Booting...</div>[m
[32m+[m[32m      <div className="text-sm mt-4 animate-boot-text">Booting...</div>[m
     </div>[m
   );[m
 };[m
