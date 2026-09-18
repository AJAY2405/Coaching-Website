import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          aria-label="Toggle theme"
          className="
            relative 
            bg-orange-100/60 dark:bg-white/10 
            backdrop-blur-md 
            border border-orange-300 dark:border-white/20 
            shadow-md 
            hover:bg-orange-200 dark:hover:bg-white/20 
            hover:scale-105 active:scale-95
            transition-all duration-300
          "
        >
          {/* ☀️ Sun */}
          <Sun
            className={`
              h-[1.2rem] w-[1.2rem] 
              text-orange-500
              transition-all duration-300
              ${
                resolvedTheme === "light"
                  ? "scale-100 rotate-0"
                  : "scale-0 rotate-90"
              }
            `}
          />

          {/* 🌙 Moon */}
          <Moon
            className={`
              absolute 
              h-[1.2rem] w-[1.2rem] 
              text-white
              transition-all duration-300
              ${
                resolvedTheme === "dark"
                  ? "scale-100 rotate-0"
                  : "scale-0 -rotate-90"
              }
            `}
          />
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown */}
      <DropdownMenuContent
        align="end"
        className="
          bg-white dark:bg-black 
          text-black dark:text-white 
          border border-orange-300 dark:border-white/20 
          shadow-lg rounded-xl
        "
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-orange-100 dark:hover:bg-white/10 cursor-pointer"
        >
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-orange-100 dark:hover:bg-white/10 cursor-pointer"
        >
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-orange-100 dark:hover:bg-white/10 cursor-pointer"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}