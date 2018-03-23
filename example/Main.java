import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    while(sc.hasNext()) {
      System.out.println(sc.nextLine());
    }

    for (int i = 0; i < args.length; i++) {
      System.out.println(args[i]);
    }

    for (int i = 0; i < 5; i++) {
      System.out.println("Hello World");
    }
  }
}
